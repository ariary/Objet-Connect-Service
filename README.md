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
 
Le miroir est équipé d'une caméra permettant de savoir si une personne se regarde dans le miroir. Le but à terme étant de mettre un algorithme de reconnaissance faciale afin de fournir des informations plus personnalisées, on peut aussi imaginer mettre en place un capteur de présence. Ceci permettrait de ne pas faire tourner la camera et donc l'algorithme en permanence et ainsi de les declencher qu'en cas de présence. 



Une fois que l'on sait qu'une personne se regarde dans le miroir, on affiche sur le miroir les informations / services.



## Scénarios d'utilisations 


### Scénario 1 

Thomas X est un employé chez TopExport. Chaque matin il prend le bus pour aller au travail. Son rituel est simple : réveil, petit dej', douche, vêtements, bus..  Mais ce matin le traffic est fluide. Le serveur de Magic Miror reçoit cette informations et se rend compte qu'en prenant le bus d'après Thomas sera quand même a l'heure. Lorsque Thomas sortira de la douche et qu'il se regardera dans le miroir, une notification lui signalera qu'il peut prendre son temps et lui indiquira l'horaire du bus inverse.  (On peut également penser au scénario inverse, Thomas est en retard.  Dans ce cas le miroir pourrait lui proposer d'envoyer un message aux participants de son rendez-vous pour leurs annoncer le retard) 
Web-service utilisés : Agenda, Info trafic, horaire bus 



### Scénario 2

Manelle X est une grand mère très attaché a sa famille. Cependant elle n'ose pas appeler ses petits enfants trop souvent, elle a peur de les déranger. Magic Miror permet à ses petits enfants de lui envoyer un message et/ou une image qui lui seront affichés sur le miroir lorsqu'elle se regardera.

## Croquis

<p align="center">

!![Miroir Magic](https://github.com/ariary/Objet-Connect-Service/blob/master/miroir%20magique.png)

</p>


## Equipements TIC :

|  EQUIPEMENTS  |   QUANTITE    | PRIX UNITAIRE |             LIEN           |
| ------------- | ------------- | ------------- | -------------------------- |
|  Raspberry Pi 3	     |  1   |27.6€ |Délivré|
|  GrovePi | 1    |24.9€|Délivré|
|  SD Carte |  1 |9.80€|Délivré|
|   |   |

## Versions



### Version 1

On va équiper la Rasberry d'un bouton (capteur) et une led (actionneur).En appuiant sur le bouton, la Raspberry signal le serveur et le demande de se connecte au API Distance Matrix (de Google) pour récupérer les informations trafiques en temps réel. Une fois que les données sont récupérées (sous forme JSON), le serveur les transmet au raspberry qui par la suite allume la led.

### Version 2

Dans ce sprint, on ajoute un simple traitement sur les données collectées:

- Détecte un utilisateur   --->   Afficher les informations trafiques sur la miroir
- Pas d'utilisateur        --->   Rien est afficher sur la miroir

Tout d'abords, on remplace le bouton par un capteur de présence qui joue le rôle de la caméra jusqu'à présent. Dès que le capteur de présence détecte l'utilisateur, le Raspberry envoie au serveur une requète pour récupérer les informations trafiques. Le serveur se connecte au API et envoie les informations demandées qui sera affichée sur l'écran jusqu'à le capteur de présence ne détecte plus l'utilisateur.

