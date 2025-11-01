### Viikon 2 tehtävä
####Jekyll-sivuston automatisointi GitHub Actionsin avulla
GitHubin Actions-ominaisuudella voi automatisoida sivustoa ainakin omaan korvaani laajasti! Jekylliä voi buildata ja julkaista GitHubin Pagesiin sivuston pushaamisella, ja buildausta voi ajastaa tapahtumaan tietyin aikavälein. Actions tarkastaa itse koodia sekä linkkejä, ja poimii niistä virheitä. Se myös auditoi suorituskykyä ja sivuston saavutettavuutta. Actionsia voi myös käyttää erilaisiin päivityksiin ja esimerkiksi sisällönhakuun API:sta. 

Käsittääkseni CI/CD-putkiston rakentamiseen voi käyttää eri työkaluja, ja GitHub Actions on nimenomaan on tällaisen putkiston "suorittaja". Lähteitä kaivellessa tuntui, että olen aivan liian taivaanrannanmaalari ymmärtämään näitä teknisempiä asioita! Työkalun tehtävänä on buildata ja sitten testata web-sovellus automaattisesti - näin toteutuu putkiston CI-vaihe, jatkuva integraatio. CD-vaihe eli jatkuva käyttöönotto voidaan suorittaa toisella työkalulla, joka automatisoi sivuston julkaisun - GitHub Pages lienee tämän mahdollistaja! 

Lähteenä käytetty: [Jekyllrb.com](https://jekyllrb.com/docs/continuous-integration/github-actions/) kurssin luentomateriaali & GitHub. Käytin tekoälyä vääntämään minulle asioita rautalangasta.
[takaisin etusivulle](index.md)
