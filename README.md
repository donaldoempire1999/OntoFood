OntoFood est une application web de gestion culinaire et nutritive dotée d'un moteur ontologique permettant de faire de la recommandation nutritive et la recherche des mets. Il est aussi doté d'un moteur de recherche textuel avec Apache Solr comme serveur et d'une interface de population basée sur GraphDB.

onto_spec: Contient tout ce qui concerne les spécifications de l'application , diagrammes de classes , architecture etc..

onto_food_ontology: contient la description semantique de notre projet (onto_food.jsonld ) qu'il faudra importer dans graphDb après installation de celui çi et query-result qui est le fichier à indexer dans Apache Solr.  

onto-food-app: Ici c'est le code de l'application fait en node JS avec Ejs comme moteur template.

-node_version: 14.04

OUTILS UTILISÉS:

   * GRAPHDB (TripleStore):

     Suivre le lien: https://www.ontotext.com/products/graphdb/ pour telecharger , pour l'installation faire:
       
         -> Dezipper le fichier.
         -> Positionnez vous dans le dossier graphDB/opt/graphdb-free.
         -> Tapez ./graphdb-free en ligne de commmande, une interface va d'afficher. Ensuite vous serrez orienter dans le navigateur.
         -> Creer un utilisateur dans graphDb avec comme username: donaldo2019 et mdp donaldo2019.
         -> Creer une repositorie avec nom: ontoFood.
         -> Importer l'ontologie dans graphDb (Situer dans le dossier onto_food_ontology: "onto_food.jsonld"
         
  
   * APACHE SOLR
     
      Suivre le lien http://solr.apache.org/downloads.html pour telechargement , telechargez la dernière version sous format .tgz, ensuite, executez les commandes       suivantes:
     
         -> Desizpper le fichier et positionnez vous dans le dossier.
         -> tapez ./bin/solr start -e cloud
         -> Suivez l'assistant, quand il va demander le nom de la collection à créer tapez "ontoFood"
   
 
   * INDEXATION DES DONNÉES TRIPLETS DANS APACHE SOLR:
   
         -> Positionnez vous dans le dossier apache solr
         -> Tapez bin/solr start -cloud -p 8983 -s "example/cloud/node1/solr"
         -> Tapez bin/post -c ontoFood  (Positon du dossier courant de apache solr)/(Position du repo local dan votre mahine)/onto_food_ontology/query-result.csv
    
  
   * NODE JS:
     
         -> Installer la version 14 de node js: https://nodejs.org/dist/v14.17.3/node-v14.17.3-linux-x64.tar.xz
         -> Installer le gestionaire de dépendances NPM
         -> Installer nodemon: **npm install nodemon**
         -> Installer l'API de communication avec GraphDb: **npm i @innotrade/enapso-graphdb-client --save**
         -> Installer l'API de communication avec apache Solr: **npm i solr-node**
         -> Taper "nodemon" en ligne de commande dans le dossier courant onto_foo_app du repo.
         
     
     Allez au navigateur et tapez localhost:3000/
     
     
    
   
         
 
   
  
     

    
