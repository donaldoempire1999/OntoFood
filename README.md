Le but ici est de construire une application avec un moteur ontologique permettant de faire de la recommandation nutritive et la recherche des mets. Il est aussi doté d'un moteur de recherche textuel et d'un interface de population.

onto_spec: Contient tout ce qui concerne les spécifications de l'application , diagrammes de classes , architecture etc..

onto_food_ontology: contient la description owl de notre projet (ONTOFOOD)

onto-food-app: Ici c'est l'application, Fais en node JS avec Ejs comme moteur template.

-node_version: 14.04

OUTILS UTILISÉS:

* GRAPHDB (TripleStore):

     Suivre le lien: https://www.ontotext.com/products/graphdb/ pour telecharger , pour l'installation faire:
       
         -> Creer un utilisateur dans graphDb avec comme username: donaldo2019 et mdp donaldo2019.
         -> Creer une repositorie avec nom: ontoFood.
         -> Importer l'ontologie dans graphDb.
         
 
  * APACHE SOLR
      Suivre le lien http://solr.apache.org/downloads.html pour telechargement , telechargez la dernière version sous format .tgz, ensuite, executez les commandes suivantes:
     -> Desizpper le fichier et positionnez vous dans le dossier
     -> tapez ./bin/solr start -e cloud
     -> Suivez l'assistant, quand il va demander le nom de la collection à créer tapez "ontoFood"
   
   * NODE JS:
     
         -> Installer la version 14 de node js: https://nodejs.org/dist/v14.17.3/node-v14.17.3-linux-x64.tar.xz
         -> Installer le gestionaire de dépendances NPM
         -> Installer nodemon: **npm install nodemon**
         -> Installer l'API de communication avec GraphDb: **npm i @innotrade/enapso-graphdb-client --save**
         -> Installer l'API de communication avec apache Solr: **npm i solr-node**
   
   * INDEXATION DES DONNÉES TRIPLETS DANS APACHE SOLR:
   
         -> Positionnez vous dans le dossier apache solr
         -> Tapez bin/solr start -cloud -p 8983 -s "example/cloud/node1/solr"
         -> Tapez bin/post -c ontoFood  (Positon du dossier courant de apache solr)/(Position du repo local dan votre mahine)/query-result.csv
         
 
   
  
     

    
