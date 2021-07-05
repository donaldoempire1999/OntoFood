let GraphDBDao = require('./graph_db')

module.exports = class Entity {

    //Commun à tout le monde
    uri = ""
    image = ""
    label = "";
    comments = [];
    isClass = false;
    infos = []; // Regroupe toute les données brûtes recupérées de chez SparQl
    objectProperties = [];
    dataProperties = [];

    //Pour recuperer tout les faits sur une entité
    facts = []

    //Ici on formalise l'affichage
    views = [];



    constructor(label = "") {
        this.label = label;
    }

    getURI(){
        return this.uri;
    }

    setURI(uri){
        this.uri = uri;
    }

    
    getImage(){
        return this.image
    }

    getFacts(){
        return this.facts;
    }

    setFacts(facts){
        this.facts = facts;
    }

    
    setImage(image_url){

        if(image_url === " "){
            this.image = "https://dummyimage.com/900x400/ced4da/6c757d.jpg";
        }else{
            this.image = image_url;
        }

    }


    setLabel(label){
        this.label = label
    }

    getLabel() {
        return this.label;
    }

    getComments(){
        return this.comments
    }

    setComments(comments){
        this.comments = comments;
    }

    getObjectProperties(){
        return this.objectProperties;
    }

    setObjectProperties(objectProperties){
        this.objectProperties = objectProperties;
    }

    getDataProperties(dataProperties){
        return this.dataProperties;
    }

    setDataProperties(dataProperties){
        this.dataProperties = dataProperties
    }



    setViews (){

        //Formatte l'affichage d'une entité par rapport au fait qu'il peut être une classe ou non.

    }

    getViews(){
        return this.views;
    }

}



