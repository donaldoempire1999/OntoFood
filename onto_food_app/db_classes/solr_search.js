let SolrNode =  require('solr-node');
const { EnapsoGraphDBClient } = require('@innotrade/enapso-graphdb-client');

require('log4js').getLogger('solr-node').level = 'DEBUG';

class SolrSearch {

    static solr_search = null;
    solr_node_instance;
    strQuery;

    static getSolrSearchInstance(){

        if (SolrSearch.solr_search == null){

            SolrSearch.solr_search = new SolrSearch();
            SolrSearch.solr_search.solr_node_instance  = new SolrNode({
                host: 'localhost',
                port: '8983',
                core: 'ontoFood',
                protocol: 'http',
            });

            return SolrSearch.solr_search;
        
        } else {
            return SolrSearch.solr_search;
        }
        
    }


    searchWord(search_word){

        return new Promise((resolve, reject) => {

            this.strQuery  = this.solr_node_instance.query().q("s:" + search_word + " or o:" + search_word).start(0).rows(100)

            this.solr_node_instance.search(this.strQuery).then(function(res, err){

                //Contient les resultats de recherche
                let result =  res.response.docs;

                result = result.filter(elm => elm.p[0] !== EnapsoGraphDBClient.PREFIX_OWL.iri.concat("disjointWith"))

                let res_uri = result.map(elm => elm.s[0]).concat(result.map(elm => elm.o[0])) // ici je prends les parties à gauche et les parties à droite

                res_uri = Array.from(new Set(res_uri)); //Eliminer les doublons

                res_uri = res_uri.filter(elm => elm.search("http://www.ontoFood.fr/") !== -1);

                resolve(res_uri);


            }).catch(err => reject(err))

        });

    }


}

module.exports = SolrSearch;
