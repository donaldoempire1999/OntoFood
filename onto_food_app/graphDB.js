"use strict"

const { EnapsoGraphDBClient } = require('@innotrade/enapso-graphdb-client');

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
            return this.#graphDBDaoInstance
        }

    }



    async getAllTriples(){
        return this.graphDBEndpoint.query(`select ?label  (COUNT(?indi) as ?num_indi)  where { 
            ?indi rdf:type ?class.
            ?class rdfs:label ?label;
         } group by ?label order by ?num_indi  `,
        { transform: 'toJSON' })
     }
}

module.exports = GraphDBDao;
