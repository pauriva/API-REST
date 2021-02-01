'use strict'
const Proyecto = use('App/Models/Proyecto');
const Tarea = use('App/Models/Tarea');
const AuthorizationService = use('App/Services/AuthorizationService');
class TareaController {
    async index({ auth, request, params}){
        const usuario = await auth.getUser();
        const {id} = params;
        const proyecto = await Proyecto.find(id);
        AuthorizationService.verifyPermission(proyecto, usuario);
        return await proyecto.tareas().fetch();
    }
    async create ({ auth, request , params}) {
        const usuario = await auth.getUser();
        const { tarea } = request.all();
        const { id } = params;
        const proyecto = await Proyecto.find(id);
        AuthorizationService.verifyPermission(proyecto, usuario);
        const tar = new Tarea();
        tar.fill({
            tarea,
        });
        await proyecto.tareas().save(tar);
        return tar;
    }
    async update ({ auth, request, params}){
        const user = await auth.getUser();
        const id = params.id;
        const tarea = await Tarea.find(id);
        const proyecto = await tarea.proyecto().fetch();
        AuthorizationService.verifyPermission(proyecto, user);
        tarea.merge (request.only ([
            'tarea',
            'completado',
        ]));
        await tarea.save();
        return tarea;
    }

    async destroy({ auth, request, params }) {
        const user = await auth.getUser();
        const { id } = params;
        const tarea = await Tarea.find (id);
        const proyecto = await tarea.proyecto().fetch();
        AuthorizationService.verifyPermission(proyecto, user);
        await tarea.delete();
        return tarea;

    }

}

module.exports = TareaController
