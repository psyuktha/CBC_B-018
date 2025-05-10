from scheme_model import SchemeModel
from scheme_controller import SchemeController
from scheme_presenter import SchemePresenter

def main():
    # Initialize components
    model = SchemeModel()
    controller = SchemeController(model)
    presenter = SchemePresenter(controller)
    
    # Example query
    query = "तेलंगाना 2BHK हाउसिंग स्कीम का मुख्य उद्देश्य गरीब लोगों को आश्रय प्रदान करना है। इस योजना के तहत, सरकार पात्र लाभार्थियों को बिना किसी लागत के आवास प्रदान करती है।"
    
    # Get and present response
    response = presenter.present_response(query)
    print(response)

if __name__ == "__main__":
    main() 