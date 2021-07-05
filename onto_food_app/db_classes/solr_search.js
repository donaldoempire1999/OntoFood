let SolrNode =  require('solr-node');
const { EnapsoGraphDBClient } = require('@innotrade/enapso-graphdb-client');
let GraphDBDao = require('./graph_db')

const buildPaginator = require('pagination-apis');

class SolrSearch {

    static solr_search = null;
    solr_node_instance;
    strQuery;
    static gb = GraphDBDao.getGraphDBDaoInstance();
    static numItemsPerPage = 8;



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


    more_about_object_properties_ressource(data_properties_ressources){

    
    }

    more_about_data_properties_ressource(objets_properties_ressources){

    
    }









    
    static more_about_pertinence_ressources(pertinence_ressources){


        return new Promise((resolve , reject) => {


                let promises = [];

                promises = pertinence_ressources.map(pertinence_ressource => {

                    let promise = SolrSearch.gb.getAllCommentsAndLabelAboutUri(pertinence_ressource);

                    promise.catch(err => console.log(err))

                    return promise;

                });

                
                Promise.all(promises).then(labels_and_comments => {
                        
                    let results =  labels_and_comments;
            
                    console.log("----------------------------------GET ALL LABELS AND COMMENTS OF PERTINENCE RESSOURCES-------------------------------------------------");
            
                    console.log(results);
            
                    results = Array.from(results.map(result => {
        
                        
                        if(toString(result) !== "not found"){
            
                                let label = result[0].label;
            
                                let comment = "";
            
                                let records = result;  
                                // Ici on va chercher le commentaire de plus grande taille dans la ligne requête
            
                                records.forEach(record => {
            
                                    if(record.comment !== undefined){
            
                                        if (record.comment.length > comment.length){
                                            comment = record.comment;
                                        }
                                    
                                    }
                                
                                })
            
            
                                return {
                                    label: label,
                                    comment: comment
                                }
                                
                            }
                            
                    }));
            
            
                    resolve(results);
            
            
               }).catch(err => reject(err))
            
               
        })
    
    } 
   

















   
   
   
   
    static more_about_on_related_comments_ressources(relations_about_comments){


        return new Promise((resolve , reject) => {

        // Allons d'abord recuperer les labels des ressources issues de relations commentaires

         let promises = [];
               
         relations_about_comments.forEach((relation_about_comment,index) => {
            
             promises.push(SolrSearch.gb.getLabel(relation_about_comment.s[0], index));
         
         });


         Promise.all(promises).then(labels_info => {
 
                   
            console.log("----------------------------------------- GET ALL LABELS INFOS-------------------------------------------------------");

                let results = Array.from(labels_info.map(label_info => {

                         if(toString(label_info) !== "not found"){

                             console.log("-------------------LABEL INFO-----------------------------");

                             console.log(label_info);
                                                    
                             let comment = relations_about_comments[label_info.index].o[0];
     
                             return {
                                 label: label_info.label,
                                 comment: comment
                             }
                        }
                     
                 }));


                 console.log("----------------COURANT RESULTS COMMENTS-----------------------");
                 console.log(results);


                 
                 //Appliquons un petit filtre
                 
                 //results = results.filter((ele , pos) => results.indexOf(ele) === pos);


                 resolve(results);

        }).catch(err => reject(err))
        
   
    })
  }










  searchWord(search_word){

        return new Promise((resolve, reject) => {


            this.strQuery  = this.solr_node_instance.query().q("s:" + search_word + "~0.9 or o:" + search_word + "~0.9 or p:" + search_word + "~0.9" ).start(0).rows(100);

            this.solr_node_instance.search(this.strQuery).then(function(res, err){

                //Contient les resultats de recherche
                let result =  res.response.docs;

                 // Elimination des éléments disjoints
                result = result.filter(elm => elm.p[0] !== EnapsoGraphDBClient.PREFIX_OWL.iri.concat("disjointWith")); 

                /*console.log("Resultat brut des relations de recherche");

                console.log(result);*/
                
     
                // Ici je recupère les relations par rapport aux commentaires
                let relations_about_comments = result.filter(elm => elm.p[0] === EnapsoGraphDBClient.PREFIX_RDFS.iri.concat('comment'));


                //On peut avoir des relations oû c'est pas une classe avec label qui est devant.
                let relations_about_comments_special = [];

           
                 // Ici Je recupère toutes les relations avec le mot recherché en dehors du commentaires.
                let relations_about_pertinence =  result.filter(elm => elm.p[0] !== EnapsoGraphDBClient.PREFIX_RDFS.iri.concat('comment'));

                 

                //Ici on recupère les ressources dites pertinentes.
                // ici je prends les parties à gauche et les parties à droite des relations dites pertinentes.
                let pertinence_ressources = relations_about_pertinence.map(elm => elm.s[0]).concat(relations_about_pertinence.map(elm => elm.o[0])) 



                pertinence_ressources = Array.from(new Set(pertinence_ressources)) //Eliminer les doublons a travers les Set et recuperer unniquement les URI

                 .filter(elm => elm.search("http://www.ontoFood.fr/") !== -1); // Rester uniquement avec les ressources              



                 //Les ressources de type object properties en relation avec le mot rechercheé
                 let pertinence_objects_properties = [];


                 // Les ressources de type DataProperties en relation avec l'element recherché
                 let pertinence_data_properties = [];

            
                //Ici on recupère toutes les ressources de object properties  notre base ,histoire de les filtrer dans les ressources pertinentes.
                SolrSearch.gb.getAllObjectProperties().then(properties => {

                 
                     pertinence_ressources.forEach((ressource) => {

                        if (properties.indexOf(ressource) !== -1){

                            pertinence_ressources = pertinence_ressources.filter(res => res !== ressource);

                            pertinence_objects_properties = pertinence_objects_properties.concat(ressource);
                          

                        }  
                    });


                  relations_about_comments.forEach(relation_about_comment => {
                         
                     
                    if(properties.indexOf(relation_about_comment.s[0]) !== -1){

                        relations_about_comments = relations_about_comments.filter(rl => rl !== relation_about_comment);
                        relations_about_comments_special = relations_about_comments_special.concat(relation_about_comment);

                     }

                    
                })
                

                      //Place maintenant aux dataProperties

                      return SolrSearch.gb.getAllDataProperties();
                
                
                
                    }).then(properties => {

                    
                        pertinence_ressources.forEach((ressource) => {

                            if (properties.indexOf(ressource) !== -1){
    
                                pertinence_ressources = pertinence_ressources.filter(res => res !== ressource);

                                pertinence_data_properties = pertinence_data_properties.concat(ressource);
                               
    
                            }  
                        })
                    


                        console.log("---------PERTINENCE RESSOURCES----------------");
                        console.log(pertinence_ressources);
                        
                        
                        console.log("----------PERTINENCE OBJECTS PROPERTIES---------");
                        console.log(pertinence_objects_properties);
                        
                        
                        console.log("--------PERTINENCE DATA PROPERTIES-------------");
                        console.log(pertinence_data_properties);
                       
                       
                        console.log("----------ABOUT RELATIONS COMMENTS---------------");
                        console.log(relations_about_comments);

                        console.log("----------ABOUT SPECIAL COMMENTS------------------");
                        console.log(relations_about_comments_special);

                        console.log("-------- PERTINENCE DATA PROPERTIES-------------------------")
                        console.log(pertinence_data_properties);

                       
                        let results_for_comments = [];
                        let results_for_pertinence = [];
                        let final_results = [];


                        SolrSearch.more_about_on_related_comments_ressources(relations_about_comments).then(results => {

                            results_for_comments = results;

                            console.log("-----------------RESULTS FOR COMMENTS----------------------");
                            console.log(results_for_comments);

 
                            return SolrSearch.more_about_pertinence_ressources(pertinence_ressources);  
                                               
                        }).then(results => {

                             results_for_pertinence = results;

                             console.log("------------------RESULTS FOR PERTINENCE--------------");
                             console.log(results_for_pertinence);


                             // Appliquons un ultime filtre

                             final_results = results_for_pertinence;

                             results_for_comments.forEach((result_for_comment) => {

                                 let bool = final_results.some(final_result => final_result.label === result_for_comment.label);

                                 if(bool === false){

                                    final_results = final_results.concat(result_for_comment);
                                 
                                }
                                
                             
                            });

                            console.log("----------------------------PAGINATION ---------------------------");


                            resolve( final_results );
                            
                        
                        }).catch(err => console.log(err))
                    
                    }).catch(err => console.log(err))
                
                
            
                
                 }).catch(err => reject(err));
 
             });


    }


}

module.exports = SolrSearch;
