let GraphDBDao = require('./graph_db')

const Class = require('./class');
const Individual = require('./individual');

module.exports = class Access{

    static gb = GraphDBDao.getGraphDBDaoInstance();

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
