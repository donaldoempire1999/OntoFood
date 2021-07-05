const { EnapsoGraphDBClient } = require('@innotrade/enapso-graphdb-client');

let Entity = require('./entity')

//Definition d'une classe
module.exports = class Class extends Entity{

    constructor(label =" ") {
        super(label);
        this.views = [

            {
                title: "Individuals",
                data: [],
                color: ["bg-individual"]
            } ,

            {
                title: "Disjoints Class",
                data: [],
                color: ["bg-secondary"],
            },

            {
                title: "SubClass",
                data: [],
                color: ["bg-dark"]
            },

            {
                title: "UpClass",
                data: [],
                color: ["bg-secondary"]
            },

            ];

    }


    //Dans le cas oû c'est une classe on récupère tout ses individuals
    setIndividuals() {

        console.log("Get individuals....")


        this.views[0].data = this.infos.filter(elm => elm.p === EnapsoGraphDBClient.PREFIX_RDF.iri.concat('type') && elm.lb2 === this.label)
        this.views[0].data = this.views[0].data.map(elm => {
            let label = elm.lb1;
            return label;
        })

        console.log("Voici ses individuals....");

        console.log(this.views[0].data);

    }

    getIndividuals(){
        return this.views[0].data;

    }

    // Dans le cas ou c'est une classe on recupère tout ses voisins
    setDisjointClass (){

        console.log("Get disjoints class...")

        this.views[1].data =  this.infos.filter(elm => elm.p === EnapsoGraphDBClient.PREFIX_OWL.iri.concat('disjointWith') && elm.lb1 === this.label);
        this.views[1].data =   this.views[1].data.map(elm => {
            let label = elm.lb2;
            return label;
        })

        console.log("Voici ses disjoints classes....");

        console.log(this.views[1].data);

    }

    getDisjointClass(){
        return this.views[1].data;
    }

    //Dans le cas ou c'est une classe on recupère toute ses sous classes
    setSubClass(){

        console.log("Get subClass....")

        this.views[2].data = this.infos.filter(elm => elm.p === EnapsoGraphDBClient.PREFIX_RDFS.iri.concat('subClassOf') && elm.lb2 === this.label)
            .filter(elm => elm.lb1 !== this.label)
        this.views[2].data =  this.views[2].data.map(elm => {
            let label = elm.lb1;
            return label;

        });

        console.log(this.views[2].data);

    }

    getSubClass(){

        return this.views[2].data;

    }

    //Dans le cas oû c'est une classe on recupère toute ses classes ascendantes
    setUpClass(){

        console.log("get UpClass...")

        this.views[3].data = this.infos.filter(elm => elm.p === EnapsoGraphDBClient.PREFIX_RDFS.iri.concat('subClassOf') && elm.lb1 === this.label)
            .filter(elm => elm.lb2 != this.label)
        this.views[3].data =  this.views[3].data.map(elm => {
            let label = elm.lb2;
            return label

        })

        console.log(this.views[3].data);

    }

    getUpClass(){

        return this.views[3].data;

    }

}


