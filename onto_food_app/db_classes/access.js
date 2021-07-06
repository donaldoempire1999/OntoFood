let GraphDBDao = require('./graph_db')

const Class = require('./class');
const Individual = require('./individual');
const SolrSearch = require('./solr_search');

module.exports = class Access{

    static gb = GraphDBDao.getGraphDBDaoInstance();

    static solr_search = SolrSearch.getSolrSearchInstance();

    static searchWord(search_word){

        return Access.solr_search.searchWord(search_word);
     
    }



    static insertTriples(triples){

        return this.gb.insertriple(triples);
    }


    static getAllProperties(){

        return new Promise((resolve, reject) => {

           let entities = []

            this.gb.getAllProperties().then(props => {

                entities = props;

                return this.gb.getAllEntities();

            }).then(class_indiv => {

                entities = entities.concat(class_indiv);

                entities = Array.from(new Set(entities));

                resolve(entities);

            }).catch(err => reject(err));

        });
    }



    static getMetByRegionAndCountry(country , region ) {

        return this.gb.getMetByRegionAndCounty(country, region);

    }

    static getMetByDisease(disease){

        return this.gb.getMetsByDisease(disease);

    }


    static getClassByIndividuals(){

        return new Promise((resolve , reject) => {

            Access.gb. getAllClassByINdividualsNumber().then(response => {

                let classes = response.records;

                let filter_classes = [];

                classes.forEach((classe) => {

                    let bool = filter_classes.some(filter_classe => filter_classe.label === classe.label);

                    if(bool === false){

                       filter_classes = filter_classes.concat(classe);
                    
                   }
                   
                
               });

                resolve(filter_classes);
            
            })
          
            .catch(err => reject(err))            
        
        });

    }


    static addCommentOrFact(uri , text , choice){

        let comment = false, fact = false;

        if (choice === "comment"){
            comment = true
        }else{
            fact = true;
        }

        
        return Access.gb.addCommentOrFact(uri, text , fact , comment);
   
    }

    static addClass(labelClass){


    }


    static addProperties(properties_ressources){


    }

    static modifyPropertie(){


    }

    
    static getEntityByLabel(label){

        return new Promise((resolve,reject) => {

            Access.gb.getAllAboutEntity(label).then(function (res) {

                let entity = null;

                if (res.isClass){

                    entity = new Class();

                    entity.setURI(res.uri);

                    //Tout les commentaires par rapport à cette entité
                    entity.setComments(res.comments.records);

                    //Ici on récupère les faits
                    console.log("------------------- Afficher les faits------------------------")
                    console.log(res.facts);
                   entity.setFacts(res.facts);

                    entity.setLabel(label)

                    //On récupère son image s'il en a 
                    entity.setImage(res.image);


                    //C'est une classe ou non
                    entity.isClass = res.isClass;

                    //Les infos en brûte sur l'entité
                    entity.infos = res.infos.records;


                    //About classes
                    entity.setIndividuals();
                    entity.setDisjointClass();
                    entity.setSubClass();
                    entity.setUpClass();

                }else {

                    entity = new Individual();

                    entity.setURI(res.uri);

                    entity.setLabel(label);

                    //Ici on récupère les faits
                    console.log("------------------- Afficher les faits------------------------")
                    console.log(res.facts);
                    entity.setFacts(res.facts);

                    entity.setImage(res.image)

                    //Tout les commentaires par rapport à cette entité
                    entity.setComments(res.comments.records);

                    //C'est une classe ou non
                    entity.isClass = res.isClass;

                    //Les infos en brûte sur l'entité
                    entity.infos = res.infos.records;

                    //About individuals
                    entity.setTypes();

                    entity.setViews();

                }


                console.log("Successful get class Entity!!")

                resolve(entity);

            }).catch(err => {

                reject(err);
            })

        })
    }

}
