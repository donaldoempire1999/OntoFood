"use strict"

const { EnapsoGraphDBClient } = require('@innotrade/enapso-graphdb-client');
const { response } = require('express');


// connection data to the running GraphDB instance
const GRAPHDB_BASE_URL = 'http://localhost:7200',
    GRAPHDB_REPOSITORY = 'ontoFood',
    GRAPHDB_USERNAME = 'donaldo2019',
    GRAPHDB_PASSWORD = 'donaldo2019',
    GRAPHDB_CONTEXT_TEST = 'http://www.ontotext.com/explicit';

const DEFAULT_PREFIXES = [
    EnapsoGraphDBClient.PREFIX_OWL,
    EnapsoGraphDBClient.PREFIX_RDF,
    EnapsoGraphDBClient.PREFIX_RDFS,
    EnapsoGraphDBClient.PREFIX_XSD,
    EnapsoGraphDBClient.PREFIX_PROTONS,
    {
        prefix: 'onto',
        iri: 'http://www.ontoFood.fr/'
    }
];




class GraphDBDao{
       
    // Singleton 
     static #graphDBDaoInstance;
    

    constructor(graphDBEnpoint){          
        this.graphDBEndpoint = graphDBEnpoint
    }

    static getGraphDBDaoInstance(){

          if (this.#graphDBDaoInstance == null){
            
            let graphDBEndpoint = new EnapsoGraphDBClient.Endpoint({
                baseURL: GRAPHDB_BASE_URL,
                repository: GRAPHDB_REPOSITORY,
                prefixes: DEFAULT_PREFIXES,
                transform: 'toJSON'
            });
            
            this.#graphDBDaoInstance = new GraphDBDao(graphDBEndpoint);

            this.#graphDBDaoInstance.graphDBEndpoint.login(GRAPHDB_USERNAME, GRAPHDB_PASSWORD)
                .then((result) => {
                    console.log(result);
                })
                .catch((err) => {
                    console.log(err);
                });

                return this.#graphDBDaoInstance;

    
        }else{
            return this.#graphDBDaoInstance;
        }

    }


    getAllCommentsAndLabelAboutUri(uri){

        return new Promise((resolve , reject) => {

            let query = "select ?label ?comment where {" +
                "?uri rdfs:label ?label. optional{ ?uri rdfs:comment ?comment.}" +
                "filter(?uri =<" + uri + ">)}"

            this.graphDBEndpoint.query(query).then(response => {
                  
                  return response.records.length !== 0 ? resolve(response.records):resolve("not found");
                  
                }).catch(err => reject(err))

        });

    }

    getLabel(uri, index){

        uri = "<".concat(uri).concat(">");
        
        return new Promise((resolve, reject) => {

            let query = "select ?label where {\n" +
            "?uri rdfs:label ?label.\n" +
            "filter(?uri =" + uri + ")}" 

           this.graphDBEndpoint.query(query).then(response => {

                return response.records.length !== 0 ? resolve({ 
                    label: response.records[0].label, 
                    index: index
                })  : resolve("not found");

            }).catch(err => reject(err))

        });     

    }












    addCommentOrFact(uri , text , fact = false , comment = false ){

        let p = ""; 

        let query = "";

        if (comment = true){

            p = "<".concat(EnapsoGraphDBClient.PREFIX_RDFS.iri.concat('comment')).concat(">");

        }else{

            p = "onto:a_pour_fait";

        }

        query = 'insert data { {'+  uri + '' + p + ' "' + text + '"}' +  '}'

        console.log(query);


         return this.graphDBEndpoint.update(query)
      
        }


    getURI(label){


        let query = "select distinct ?uri where {\n" +
            "    ?uri rdfs:label ?lb1.\n" +
            "      filter(?lb1 = '"+label+"')\n" +
            " }"

        return this.graphDBEndpoint.query(query);

    }


   


    getAllClassByINdividualsNumber(){
        return this.graphDBEndpoint.query(`select ?label (COUNT(?indi) as ?num_indi) ?comment  where { 
           ?class rdfs:label ?label;
                rdf:type rdfs:Class.
           OPTIONAL { ?indi rdf:type ?class.}
           OPTIONAL {?class rdfs:comment ?comment}
            } group by ?label ?comment `,
        { transform: 'toJSON' })
    }

    
    getAllInfoAboutEntity(label){

        if(label.search('\'') != -1){label = escape(label)}
      

        let query = "select ?lb1 ?p ?lb2  where {\n" +
            "    {?s rdfs:label ?lb1;\n" +
            "        ?p ?o.\n" +
            "        ?o rdfs:label ?lb2.\n" +
            "        filter(?lb1 = '"+label+"')\n" +
            "    }\n" +
            "    union{\n" +
            "    ?o rdfs:label ?lb2.\n" +
            "       ?s ?p ?o;rdfs:label ?lb1.\n" +
            "        filter(?lb2 = '"+label+"')\n" +
            "      }\n" +
            "  }"

        return this.graphDBEndpoint.query(query);
     }



     getAllObjectProperties(){

        return new Promise((resolve , reject) => {

            let query = "select ?s where { "+
                "?s rdf:type owl:ObjectProperty."+
             "}"

             this.graphDBEndpoint.query(query).then(response => {

                let properties = response.records.map(row => row.s);

                resolve(properties)
             
            
            }).catch(err => reject(err)); 
         
        
        });
    
    }



    getAllDataProperties(){

        return new Promise((resolve , reject) => {

            let query = "select ?s where { "+
                "?s rdf:type owl:DatatypeProperty."+
             "}"

             this.graphDBEndpoint.query(query).then(response => {

                let properties = response.records.map(row => row.s);

                resolve(properties);
             
            
            }).catch(err => reject(err)); 
         
        
        });
    
    }





     getCommentsAboutLabel(label){

        if(label.search('\'') != -1){label = escape(label)}


        let query = "select ?comment where {" +
            "?s rdfs:label '" +label + "';" +
            "rdfs:comment ?comment.}"

         return this.graphDBEndpoint.query(query);

      }

      isClass(label,infos) {

        return infos.records.some(elm => elm.lb1 === label && elm.p === EnapsoGraphDBClient.PREFIX_RDFS.iri.concat('subClassOf'));

     }


     getInstances(label, infos){

        return infos.records.filter(function(elm){
            return elm.p === EnapsoGraphDBClient.PREFIX_RDF.iri.concat('type')
        })
    }



     getAllAboutEntity(label) {

        let myClass = this;

        return new Promise(function(resolve , reject){

           let resulat = {uri: "",label: label , comments: "", infos: "", isClass: "",  types: "" };

           //Obtenir toutes les informations par rapport à l'entité et les autres
    
            myClass.getAllInfoAboutEntity(label).then(function(infos){

                console.log("Voici toutes les informations sur " + label +" et toute les autres entités du domaine");
                console.log(infos);

                resulat.infos = infos;

                resulat.isClass = myClass.isClass(label, infos)
                console.log("Recherche du type de l'entité , est t-il une classe ?: " + resulat.isClass )

                return myClass.getCommentsAboutLabel(label);

            
            }).then(function(comments){
                
                resulat.comments = comments;

                console.log("voici les commentaires...");
                
                console.log(comments);

                return myClass.getURI(label);

            }).then(uri_res => {

                console.log("Voici L'URI de notre ressource...");

                let uri = uri_res.records[0].uri;

                resulat.uri = "<".concat(uri).concat(">");

                console.log(resulat.uri);

                resolve(resulat);

            })
            
            .catch(function(err){

                console.log(err);

            })
        
        })
    }



}

module.exports = GraphDBDao;
