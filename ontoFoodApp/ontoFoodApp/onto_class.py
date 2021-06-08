from franz.openrdf.connect import ag_connect
from franz.openrdf.query.queryresult import QueryResult
from franz.openrdf.repository import Repository
from franz.openrdf.rio.tupleformat import TupleFormat
from franz.openrdf.sail import AllegroGraphServer
from franz.openrdf.sail.allegrographserver import Catalog
from franz.openrdf.repository.repositoryconnection import RepositoryConnection
from franz.openrdf.vocabulary import RDF
from franz.openrdf.query.query import QueryLanguage
from ontoFoodApp import settings


class OntoFoodConnect:
    # Instance onto_food_connect
    onto_inst = None  # type: OntoFoodConnect

    # Nom de notre repo
    repo_name = "ontoFood"

    # Nom du catalogue ou se trouve notre repo
    catalog_name = ""

    # Mode de connexion
    conn_mode = Repository.OPEN

    @staticmethod
    def getConnectInstance():

        if OntoFoodConnect.onto_inst is None:

            print("connection to allegroGraph server..... ", "host: '%s' , port: '%s'" %
                  (settings.ONTO_HOST, settings.ONTO_PORT))

            # Ici on demarre une instance notre serveur
            server_inst = AllegroGraphServer(settings.ONTO_HOST, settings.ONTO_PORT,
                                             settings.ONTO_USER,
                                             settings.ONTO_PASSWORD)

            # Ici on récupère notre catalogue contenant notre repositorie
            print('open the root catalog..........')
            catalog_inst = server_inst.openCatalog(OntoFoodConnect.catalog_name)

            # Ici on récuprère notre instance repository
            print('Get the ontofood repositories....')
            repo_inst = catalog_inst.getRepository(OntoFoodConnect.repo_name, OntoFoodConnect.conn_mode)

            # Ici on recupère une instance de connexion de notre de repo
            print('Get the connexion instance .......')
            conn_inst = repo_inst.getConnection()

            # Creation d'un objet onto_food_connect
            OntoFoodConnect.onto_inst = OntoFoodConnect(server_inst, catalog_inst, repo_inst, conn_inst)

            return OntoFoodConnect.onto_inst
        else:
            return OntoFoodConnect.onto_inst

    def __init__(self, serv_inst, catalog_inst, repo_inst, conn_inst):

        # Instance de notre serveur AllegroGraph
        self.server_inst = serv_inst  # type: AllegroGraphServer

        # Instance de notre catalogue
        self.catalog_inst = catalog_inst  # type: Catalog

        # Instance de notre repository
        self.repo_inst = repo_inst  # type: Repository

        # Instance de connexion
        self.conn_inst = conn_inst  # type: RepositoryConnection


class OntoFoodDao:
    
    name_space = "http://www.ontoFood.fr/"
    
    def __init__(self):
        # Recuperation de l'objet onto_food_instance
        self.conn = OntoFoodConnect.getConnectInstance().conn_inst
        self.repo = OntoFoodConnect.getConnectInstance().repo_inst

    
    
    def get_all_sauces(self):
        self.conn.setNamespace('', OntoFoodDao.name_space)
        query = self.conn.prepareTupleQuery(query=
          """SELECT ?res_sauce ?typ_sauce ?nom_sauce { ?res_sauce rdf:type ?typ_sauce.
                       ?typ_sauce rdfs:subClassOf ?t.
                       ?t rdfs:subClassOf :Sauce.
                       ?res_sauce :a_pour_nom_conv ?nom_sauce
                   }""")
        
        sauces = []
        index = 0

        with query.evaluate() as result:
            for bindings in result:
                sauces.insert(index, (bindings.getValue('res_sauce'), bindings.getValue('typ_sauce'), bindings.getValue('nom_sauce')))
                index+=1
        
        return sauces

    
    
    # Le rôle de cette fonction est de me permettre de definir l'URI d'une ressource
    def makeRessourceURI(self, ressource_name):
        return self.conn.createURI(namespace=OntoFoodDao.name_space, localname=ressource_name)

