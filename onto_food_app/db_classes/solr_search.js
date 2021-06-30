var SolrNode =  require('solr-node');

require('log4js').getLogger('solr-node').level = 'DEBUG';

class SolrSearch {

    solr_node_instance = null;

    static getSolrSearchInstance(){

        if (this.solr_node_instance == null){

            this.solr_node_instance = new SolrNode({
                host: 'localhost',
                port: '8983',
                core: 'ontoFood',
                protocol: 'http',
            });

            var strQuery = this.solr_node_instance.query().q('s: couscous mais sauce ndolè').start(0).rows(25);

            this.solr_node_instance.search(strQuery).then(function(res, err){

                console.log(res);

                res.response.docs.forEach(element => {
                      
                    console.log(element.s + " " +  element.p +  " " + element.o);
                });
            })
            
            return this.solr_node_instance;
        
        } else {
            return this.solr_node_instance;
        }
        
    }


}

module.exports = SolrSearch;