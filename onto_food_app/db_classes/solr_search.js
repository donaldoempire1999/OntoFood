let SolrNode =  require('solr-node');

require('log4js').getLogger('solr-node').level = 'DEBUG';

class SolrSearch {

    static solr_node_instance = null;

    static getSolrSearchInstance(){

        if (SolrSearch.solr_node_instance == null){

            SolrSearch.solr_node_instance = new SolrNode({
                host: 'localhost',
                port: '8983',
                core: 'ontoFood',
                protocol: 'http',
            });

            return SolrSearch.solr_node_instance;
        
        } else {
            return this.solr_node_instance;
        }
        
    }


    searchWord(search_word){

        var strQuery = this.solr_node_instance.query().q('s: couscous mais sauce ndolè').start(0).rows(25);

        this.solr_node_instance.search(strQuery).then(function(res, err){

            console.log(res);

            res.response.docs.forEach(element => {

                console.log(element.s + " " +  element.p +  " " + element.o);
            });
        })

    }


}

module.exports = SolrSearch;
