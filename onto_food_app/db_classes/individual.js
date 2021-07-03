const { EnapsoGraphDBClient } = require('@innotrade/enapso-graphdb-client');

const Entity = require('./entity')

//Definition d'un individual
module.exports =  class Individual extends Entity{

    //Concernant les individuals
    types = [];


    constructor(label = "") {
        super(label);
        this.views = [

            {
                title: "Composition",
                data: [],
                color: ["bg-individual"],
                filter: 'http://www.ontoFood.fr/est_composé_de',
            } ,

            {
                title: "Entre dans la composition de ",
                data: [],
                color: ["bg-secondary"],
                filter: 'http://www.ontoFood.fr/entre_dans_la_composition_de'
            },

            {
                title: "Entre dans preparation de ",
                data: [],
                color: ["bg-secondary"],
                filter: 'http://www.ontoFood.fr/entre_dans_la_preparation_de'
            },

            {
                title: "Apport Nutritif",
                data: [],
                color: ["bg-dark"],
                filter: 'http://www.ontoFood.fr/est_constitué_de'
            },

            {
                title: "Recette",
                data: [],
                color: ["bg-success"],
                filter: 'http://www.ontoFood.fr/se_prepare_avec'

            },

            {
                title: "Origine",
                data: [],
                color: ["bg-secondary"],
                filter: 'http://www.ontoFood.fr/est_une_spécialiatié_du',

            },

            {
                title: "Conseiller Pour",
                data: [],
                color: ["bg-danger"],
                filter: 'http://www.ontoFood.fr/est_conseillé_pour',

            },

            {
                title: "Epice",
                filter: 'http://www.ontoFood.fr/a_pour_epice',
                data: [],
                color: ["bg-secondary"]

            }


        ];
    }

    setViews(){

        this.views.forEach((view, index) => {

            console.log("Set " + view.title);

            view.data = this.infos.filter(elm => elm.p === view.filter && elm.lb1 === this.label)

            view.data = view.data.map(elm => {

                let label = elm.lb2;

                return label;

            });

            console.log(view);

        })
    }


    // Ici on recupère ses types si c'est un individual
    setTypes() {

        console.log("Set types....")

        this.types = this.infos.filter(elm => elm.p === EnapsoGraphDBClient.PREFIX_RDF.iri.concat('type') && elm.lb1 === this.label)
            .filter(elm => elm.lb2 !== "Thing")
        this.types = this.types.map(elm => {
            let label = elm.lb2;
            return label;
        });

        console.log("Voici ses types...");

        console.log(this.types);

    }

    getTypes(){
        return this.types;
    }


}



