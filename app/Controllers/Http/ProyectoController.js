'use strict'
const Proyecto = use('App/Models/Proyecto');
const AuthorizationService = use ('App/Services/AuthorizationService');

class ProyectoController {
    async index ({ auth}) {
        const user = await auth.getUser();
        return await user.proyectos().fetch();
       
    }
    async create({ auth, request}) {
        const user = await auth.getUser();
        const { proyecto } = request.all();  
        const proy = new  Proyecto();
        proy.fill({
            proyecto: proyecto,
            
    
        });
        await user.proyectos().save(proy);
        return proy;
       
    }
    
        async destroy ({ auth, request, params }) {
            const user = await auth.getUser();
            const  { id } = params;
            const proyecto = await Proyecto.find(id);
           
            AuthorizationService.verifyPermission(proyecto, user);
            await proyecto.delete();
            return proyecto;
    
    
        }
        async update ({ auth, request, params}) {
            const user = await auth.getUser();
            const { id } = params;
            const proyecto = await Proyecto.find(id);
            AuthorizationService.verifyPermission(proyecto, user);
            proyecto.merge (request.only ([
               'proyecto' ,
            ]));
            await proyecto.save();
            return proyecto;
        }
}

module.exports = ProyectoController
