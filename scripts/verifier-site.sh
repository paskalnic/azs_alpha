#!/usr/bin/env bash
#
# Vérifie un déploiement du site, en production comme sur l'adresse Netlify.
#
#   bash scripts/verifier-site.sh                                    # le domaine
#   bash scripts/verifier-site.sh https://jocular-licorice-ef0a42.netlify.app
#
# À lancer le lendemain du raccordement du domaine, puis après toute
# intervention sur le DNS. Chaque contrôle correspond à une façon concrète de
# perdre le référencement acquis par l'ancien site : une adresse disparue, un
# noindex resté en place, une canonique qui vise la mauvaise adresse.
#
# Code de sortie 0 si tout passe, 1 sinon : utilisable tel quel dans un script.

set -u
BASE="${1:-https://azsalphaformations.com}"
BASE="${BASE%/}"
DOMAINE="https://azsalphaformations.com"
echecs=0

ok()   { printf '  \033[32mOK\033[0m    %s\n' "$1"; }
ko()   { printf '  \033[31mÉCHEC\033[0m %s\n' "$1"; echecs=$((echecs + 1)); }
code() { curl -s -o /dev/null -m 20 -w '%{http_code}' "$1"; }

echo "Vérification de $BASE"
echo

# Les 26 adresses que publiait le WordPress, relevées dans son sitemap avant
# la refonte. Liste figée volontairement : c'est l'héritage à protéger, pas la
# table de routage actuelle — une page ajoutée depuis n'a rien à perdre.
echo "Adresses héritées de l'ancien site"
HERITEES="
/
/accueil-physique/
/accueil-telephonique/
/anglais-general-en-groupe/
/anglais-general-individuel/
/anglais-tourisme/
/communication-courante/
/conditions-generales-de-vente-aux-particuliers/
/conditions-generales-de-vente-aux-professionnels/
/conditions-generales-dutilisation/
/contact/
/formation-anglais/
/formation-en-accueil/
/formation-francais/
/lutte-contre-lilletrisme/
/maitriser-les-ecrits/
/mentions-legales/
/nos-engagements-qualite/
/nos-formations/
/nos-prestations/
/politique-de-confidentialite/
/preparation-au-toeic/
/reglement-interieur/
/remise-a-niveau/
/utilisation-des-cookies/
"
bonnes=0
for chemin in $HERITEES; do
  c=$(code "$BASE$chemin")
  if [ "$c" = "200" ]; then bonnes=$((bonnes + 1)); else ko "$chemin répond $c au lieu de 200"; fi
done
[ "$bonnes" -eq 25 ] && ok "25 pages sur 25 répondent en 200"

# La seule adresse sans équivalent : redirigée, jamais en 404.
redir=$(curl -s -o /dev/null -m 20 -w '%{http_code} %{redirect_url}' "$BASE/inscription-formation/")
case "$redir" in
  "301 "*"/contact/") ok "/inscription-formation/ redirige en 301 vers /contact/" ;;
  *) ko "/inscription-formation/ : attendu 301 vers /contact/, obtenu « $redir »" ;;
esac
echo

echo "Indexation"
accueil=$(curl -s -m 20 "$BASE/")
if printf '%s' "$accueil" | grep -qi 'name="robots"[^>]*noindex'; then
  ko "l'accueil porte une balise noindex"
else
  ok "aucune balise noindex sur l'accueil"
fi
if curl -sI -m 20 "$BASE/" | grep -qi '^x-robots-tag:.*noindex'; then
  ko "l'accueil est servi avec un en-tête X-Robots-Tag: noindex"
else
  ok "aucun en-tête noindex sur l'accueil"
fi
canon=$(curl -s -m 20 "$BASE/preparation-au-toeic/" | grep -o '<link rel="canonical" href="[^"]*"' | sed 's/.*href="//; s/"$//')
if [ "$canon" = "$DOMAINE/preparation-au-toeic/" ]; then
  ok "canonique vers le domaine définitif"
else
  ko "canonique inattendue : « $canon »"
fi
if curl -s -m 20 "$BASE/sitemap.xml" | grep -q "<loc>$DOMAINE/"; then
  ok "sitemap.xml annonce les adresses du domaine"
else
  ko "sitemap.xml absent ou sans adresse du domaine"
fi
if curl -s -m 20 "$BASE/robots.txt" | grep -qi "^Sitemap: $DOMAINE/sitemap.xml"; then
  ok "robots.txt désigne le sitemap"
else
  ko "robots.txt ne désigne pas $DOMAINE/sitemap.xml"
fi
c=$(code "$BASE/page-qui-n-existe-pas-$$/")
[ "$c" = "404" ] && ok "une page inexistante répond 404" || ko "une page inexistante répond $c au lieu de 404"
echo

echo "Back-office"
entetes_admin=$(curl -sI -m 20 "$BASE/admin/")
printf '%s' "$entetes_admin" | grep -qi '^x-robots-tag:.*noindex' \
  && ok "/admin/ fermé aux moteurs" || ko "/admin/ sans X-Robots-Tag: noindex"
printf '%s' "$entetes_admin" | grep -qi '^cache-control:.*no-store' \
  && ok "/admin/ jamais mis en cache" || ko "/admin/ sans Cache-Control: no-store"
echo

echo "En-têtes"
entetes=$(curl -sI -m 20 "$BASE/")
for e in x-content-type-options referrer-policy x-frame-options; do
  printf '%s' "$entetes" | grep -qi "^$e:" && ok "$e présent" || ko "$e absent"
done
if [ "${BASE#https://}" != "$BASE" ]; then
  printf '%s' "$entetes" | grep -qi '^strict-transport-security:' \
    && ok "HTTPS imposé (HSTS)" || ko "HSTS absent — le certificat est-il délivré ?"
fi
echo

if [ "$echecs" -eq 0 ]; then
  printf '\033[32mTout est conforme.\033[0m\n'
  exit 0
fi
printf '\033[31m%d contrôle(s) en échec.\033[0m\n' "$echecs"
exit 1
