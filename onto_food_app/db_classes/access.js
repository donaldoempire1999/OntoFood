let GraphDBDao = require('./graph_db')

const Class = require('./class');
const Individual = require('./individual');
const SolrSearch = require('./solr_search');

module.exports = class Access{

    static gb = GraphDBDao.getGraphDBDaoInstance();

    static solr_search = SolrSearch.getSolrSearchInstance();

    static searchWord(search_word){

        return new Promise((resolve , reject) => {

            this.solr_search.searchWord(search_word).then(res_uri => {

                let promises_uri = res_uri.map(x => {

                    let promise = Access.gb.getAllCommentsAndLabelAboutUri(x)

                    promise.catch(err => console.log(err))

                    return promise;

                });

                Promise.all(promises_uri).then(resp => {

                    console.log("Resultat de la requête formatée!!!")

                    resolve(resp);

                }).catch(err => reject(err));

            });

        });

    }

    static addClass(labelClass){


    }


    static addProperties(properties_ressources){


    }

    static modifyPropertie(){


    }

    static getClassByIndividuals(){

        return new Promise((resolve, reject) => {

            Access.gb.getAllClassByINdividualsNumber().then(res => {

                resolve(res)

            }).catch(err => {

                console.log(err)

            })

        })

    }

    static getEntityByLabel(label){

        return new Promise((resolve,reject) => {

            Access.gb.getAllAboutEntity(label).then(function (res) {

                let entity = null;

                if (res.isClass){

                    entity = new Class();

                    //Tout les commentaires par rapport à cette entité
                    entity.setComments(res.comments.records);

                    entity.setLabel(label)

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

                    entity.setLabel(label)

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
