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
| Capteur de distance |  1  |  6.2 €  |https://www.gotronic.fr/art-detecteur-de-distance-ir-grove-101020175-26434.htm|
|  Moniteur |   1  |-|-|
|  Vitre sans tain |   1( même taille du moniteur )|-|-|
|  Module enregistreur (micro + haut parleur) |   1  |  -  |livré|
|  Câble HDMI   |   1  |  5 €  |https://www.gotronic.fr/art-cable-dore-hdmi11-15432.htm|
|  Détecteur de lumière  |   1  |  3.05 €  |https://www.gotronic.fr/art-detecteur-de-lumiere-grove-v1-2-101020132-25427.htm|

## Versions

### Version 1

La première étape de ce sprint consiste à équiper notre Raspberry par un bouton (capteur) et une LED (actionneur). En appuyant sur le bouton, la Raspberry signal le serveur et le demande de se connecte à l’API Distance Matrix (de Google) pour récupérer les informations trafiques en temps réel. Une fois que les données sont récupérées (sous forme JSON), le serveur les transmet au Raspberry qui par la suite allume la LED.

### Version 2

Dans ce Sprint, la détection de présence reste toujours à travers le bouton puisqu’on a pas encore le capteur de présence. 

Donc, la première étape est d’appliquer la nouvelle architecture présentée ci-dessus. C’est à dire, lorsqu’on  clique sur le bouton, le Raspberry pi se connecte au Broker et publie les données au format JSON dans le Topic « push_button ». Pour exploiter ses données notre serveur (c à d la partie applicative de notre système ) doit s’inscrire au même Topic. Dès que notre côté applicative détecte la présence de la personne (bouton cliqué), il se connecte au API Distance matrix de Google qui présente notre premier service pour récupérer l’état du trafic. Ce résultat obtenu soit transféré au Broker qui par la suite l’affiche sur le Raspberry.

Une fois ceci est fait, nous allons utiliser la même architecture lors de la récupération des données du capteur de lumière. De façon que notre Raspberry se connecte au Broker et publie les données au format JSON dans le Topic “push_lumière”. Le serveur fait un subscribe au même Topic, récupère les données et fait un simple traitement en vérifiant la luminosité de la chambre et renvoie une réponse au Broker, s’il faut changer la luminosité de la lampe. On peut simuler ce scénario en utilisant Wcomp pour communiquer notre broker à une lampe connectée. D’où l’utilité de cette architecture.

Finalement, on doit permettre la communication avec service météo qui est déjà effectuée.


### Version 3

On a une architecture utilisant un broker permettant aussi au mirroir d'avoir cette fonctionnalité d' "afficheur". le miroir utilise déjà des capteurs de présence, de luminosité. On peut imaginer un scénario où le detecteur de présence ne detecte lus de présence et dans un même temps la lumière est allumé. Si la lumière utilise le protocole WCOMP on peut alors l'éteindre.
Au niveau des services on peut donner l'état du traffic (qui est communiqué à l'utilisateur lorsque celui-ci est détecté devant le miroir) et la météo.

Le but de la version 3 est de prendre en compte le micro. Au niveau des services, synchroniser les mails de l'utilisateur.
Ceci pour répondre au scénario suivant: un utilisateur se présente devant le miroir, le miroir lui signale qu'il a un mail d'une personne en particulier (que l'on configure auparavant), en utilisant le micro (par exemple avec la commande "lire") le miroir lui affiche.


