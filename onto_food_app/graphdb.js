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

        let result = await this.graphDBEndpoint.query(`select ?s ?o ?nom_conv ?nom_tradi from
         <${GRAPHDB_CONTEXT_TEST}> where { ?s onto:est_composé_de ?o. ?s a_pour_nom_conv ?nom_conv. ?s a_pour_nom_tradi ?nom_tradi} `,
        { transform: 'toJSON' })

        return result
          
     }

}

module.exports = GraphDBDao;