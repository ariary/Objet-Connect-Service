<p align="center">

![logo](https://github.com/ariary/Objet-Connect-Service/blob/master/Untitled%20(2).png)

</p>

Votre assistant domestique personnalisé 
===================
---
Groupe
-------------
- Rabenandrasana Antoine,antoine.rabenandrasana@etu.unice.fr, CASPAR
- Chebaane Meriem, meriem.chebaane@etu.unice.fr, IAM
- Ben Aouicha Zeineb, zeineb.benaouicha@esprit.tn, IAM

## Contexte général
*Est ce qu'un miroir peut être intelligent ?*

Aujourd'hui, la plupart des gens vivent avec un chronomètre à la main: il faut faire se laver les dents, il faut manger, il faut faire plein de choses et dans la salle de bain ou dans l'entrée là où on a un petit miroir où on passe un petit peu de temps. D'où L'idée d'un miroir Magique qui permet de faciliter le quotidien sans pour autant être trop intrusif dans la vie des utilisateurs. 


*C'est-à-dire ?*

En se connectant a divers services web (comme la météo, les bus, les mails), des informations vont être choisis et afficher sur le miroir. 


*Comment ça fonctionne ?*
 
Le miroir est équipé d'un capteur de présence permettant de savoir si une personne est présent devant le miroir. Le but à terme étant de mettre une condition (qui est la présence de l'utilisateur) afin de déclencher le fonctionnement du miroir. 
Une fois que l'on sait qu'une personne est devant le miroir, on affiche les informations et les services offertes .

## Scénarios d'utilisations 


### Scénario 1 

Thomas X est un employé chez TopExport. Chaque matin il prend le bus pour aller au travail. Son rituel est simple : réveil, petit dej', douche, vêtements, bus..  Mais ce matin le traffic est fluide. Le serveur de Magic Miror reçoit cette informations et se rend compte qu'en prenant le bus d'après Thomas sera quand même a l'heure. Lorsque Thomas sortira de la douche et qu'il se regardera dans le miroir, une notification lui signalera qu'il peut prendre son temps et lui indiquira l'horaire du bus inverse.  (On peut également penser au scénario inverse, Thomas est en retard.  Dans ce cas le miroir pourrait lui proposer d'envoyer un message aux participants de son rendez-vous pour leurs annoncer le retard) 
Web-service utilisés : Agenda, Info trafic, horaire bus 

### Scénario 2

Manelle X est une grand mère très attaché a sa famille. Cependant elle n'ose pas appeler ses petits enfants trop souvent, elle a peur de les déranger. Magic Miror permet à ses petits enfants de lui envoyer un message qui lui seront affichés sur le miroir.

### Scénario 3

Marie X est une mère de 3 enfants. Tellement son emploi est encombré entre le boulot et les enfants, elle oublie souvent la lumière ouverte. Grâce au miroir magique qui est équipé par un capteur de luminosité, elle n'a plus de soucis. Le miroir permet de gérer la lumière de la chambre automatiquement en fonction de la présence de la personne. C'est à dire si la personne est présente devant le miroir, il allume la lampe et vice versa (si le miroir ne détecte plus la personne et que la lumière est encore ouverte, le miroir ferme la lumière.).

## Croquis

<p align="center">

![Miroir Magic](https://github.com/ariary/Objet-Connect-Service/blob/master/miroir%20magique.png)

</p>


## Equipements TIC :

|  EQUIPEMENTS  |   QUANTITE    | PRIX UNITAIRE |             LIEN           |
| ------------- | ------------- | ------------- | -------------------------- |
|  Raspberry Pi 3	     |  1   |  44.95€ |livré|
|  GrovePi | 1   |  37.21€  |livré|
|  SD Carte |  1  |  9.80€  |livré|
|  Caméra Pi |  1  |  27,60 €  |https://www.gotronic.fr/art-module-camera-5-mp-raspberry-pi-rpi04v2-24876.htm|
|  Moniteur |   1  |-|-|
|  Vitre sans tain |   1( même taille du moniteur )|-|-|
|  Module enregistreur (micro + haut parleur) |   1  |  9,50 €  |https://www.gotronic.fr/art-module-enregistreur-20s-isd1820-25652.htm|
|  Câble HDMI   |   1  |  5,75 €  |https://www.amazon.fr/gp/product/B00870ZHCQ/ref=as_li_ss_tl?ie=UTF8&camp=1642&creative=19458&creativeASIN=B00870ZHCQ&linkCode=as2&tag=website0b2-21|

## Versions



### Version 1

La première étape de ce sprint consiste à équiper notre Raspberry par un bouton (capteur) et une LED (actionneur). En appuyant sur le bouton, la Raspberry signal le serveur et le demande de se connecte à l’API Distance Matrix (de Google) pour récupérer les informations trafiques en temps réel. Une fois que les données sont récupérées (sous forme JSON), le serveur les transmet au Raspberry qui par la suite allume la LED.

### Version 2

Dans ce sprint, on ajoute un simple traitement sur les données collectées:

- Détecte un utilisateur   --->   Afficher les informations trafiques sur la miroir
- Pas d'utilisateur        --->   Rien est afficher sur la miroir

Tout d'abords, on remplace le bouton par un capteur de présence qui joue le rôle de la caméra jusqu'à présent. Dès que le capteur de présence détecte l'utilisateur, le Raspberry affiche un message "Bienvenue" sur l'écran et envoie au serveur une requète pour récupérer les informations trafiques. Le serveur se connecte au API et envoie les informations demandées qui sera affichée sur l'écran jusqu'à le capteur de présence ne détecte plus l'utilisateur.

