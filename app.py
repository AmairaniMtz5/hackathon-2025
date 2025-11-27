import web
from controllers.home_controller import HomeController

urls = (
    '/', 'HomeController',
)

app = web.application(urls, globals())

if __name__ == "__main__":
    app.run()
