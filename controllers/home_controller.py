import web

render = web.template.render('views/')

class HomeController:
    def GET(self):
        # Aquí podrías llamar a modelos si hace falta
        return render.index()
