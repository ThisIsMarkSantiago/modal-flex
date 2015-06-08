# modal-flex

Flexible angular-bootstrap wrapper.

**Install with bower**

    bower install modal-flex

**Inject in module**

    var app = angular.module('yourModule', [
      ...
      'modalFlex',
      ...
    ]);

**Inject in controller**

    var app = angular.module('yourModule', [
      ...
      'modalFlex',
      ...
    ]).controller('yourController', function($scope, $fmodal){
      ...
    });

Usage
--------------

    $fmodal.open(options, close, dismiss);

**options**

    method
        - string ['show', 'edit', 'delete']
        - used to define what type of modal to call
        - defaults to 'show' if not defined

    type
        - string
        - used to replace "Are you sure you want to delete this {{type}}" in the delete modal
        - defaults to 'object' if not defined

    object
        - Object
        - the object to be display, edit, or deleted
        - sample : {id: '1234567890', name: 'Juan Dela Cruz'}

    show
        - Array
        - the list of keys of the object that will be displayed
        - if not defined, all keys of the object will be displayed alphabetically
        - sample : ['name', 'address', 'age']
        - note : the keys will be displayed in the modal according to the order you declared in this option

    capitalize
        - Boolean
        - set to false to disable capitalizing keys

    options || radios
        - Array[{ key: 'keyName', options: arrayOfOptions}]
        - used to define all keys of the object that needs to be a combobox/radio-button instead of a textbox
        - sample:
            [   {key: 'civilStatus', options: ["Single", "Married", "Widowed"]},
                {key: 'yearJoined', options: ['2000', '2001', '2002']},
                {key: 'referrer', options: [{id:'10064', name:'Jose P. Rizal'}, {id:'10065', name:'Andres Bonifacio'}]
        - note: if the array of options is an object, it will display the name but the value will be the id

    numbers || textAreas || emails || passwords || checkboxes
        - Array[String]
        - used to define all keys of the object that needs to be a number-box/textarea/email-box/password-box/checkbox instead of a textbox
        - sample: ["price","age"]
        - sample: ["description","comment"]

    readOnly
        - Array[String]
        - used to define all keys of the object that will be on read-only state
        - sample: ["id","password"]

    required
        - Array[String]
        - used to define all keys of the object that is required
        - sample: ["name","category"]
    
    onOk
        - function(object, close, error)
        - the callback function to be called when the Ok[Save/Delete] button is clicked.
            - object : returns the edited object
            - close : returns a function you can call to invoke the "close" modal
                - the modal wont close if you dont call this function
                - takes a one parameter : the value to return when the modal is closed
                - to invoke: close() or close(object)
            - error : returns a function you can call to display an error
                - takes a one parameter : the error message, can be a string on an HTML template
                - to invoke: error('The server returned a 404 error') or error('<h1>The server returned a 500 error</h1>')
        - if not defined, the modal will close automatically when the Ok[Save/Delete] button in clicked

    onCancel
        - function(object, message)
        - the callback function to be called when the Cancel button is clicked.
            - object : returns the modified object
            - close : returns a function you can call to invoke the "dismiss" modal
                - the modal wont close if you dont call this function
                - takes a one parameter : the value to return when the modal is closed
                - to invoke: close() or close("canceled")
        - if not defined, the modal will close automatically when the Cancel button in clicked

    okText
        - String
        - overrides the Save/Delete text on the modal button

    cancelText
        - String
        - overrides the Cancel text on the modal button

    titleText
        - String
        - sets the modal title text
        - if method is 'delete', defaults to 'Are you sure you want to delete this object?'
        - if method is 'edit', defaults to obect's name key, and blank if obect's name key is not defined

    message
        - HTML text
        - displays a message in the modal

    displayCancel
        - Boolean
        - option to display the cancel button

    icons
        - Boolean
        - if set false, the button icons wont be displayed

**close**

    - the callback function when the modal is closed

**dismiss**

    - the callback function when the modal is dismissed

Sample
--------------

**Show Modal**


    $scope.showDetails = function (product) {
        $fmodal.open({
            method: "show", // you can also not write this line
            object: product,
            show: [
                "description",
                "category",
                "price",
                "image",
                "store"
            ]
        })
    };

![alt tag](http://i288.photobucket.com/albums/ll178/santiagomarkbenedictesguerra/Screenshot%20from%202015-06-02%20150144_zpstl9vrobi.png)

**Create Modal**
    
    var defaultProduct = {
        name: "New Product",
        description: undefined,
        category: undefined,
        price: undefined,
        image: undefined
    }
    $scope.addProduct = function () {
        $fmodal.open({
            method: "edit",
            object: defaultProduct,
            options: [
                { key: "category", options: [{id:'001',name:'small'}, {id:'002',name:'big'}] }
            ],
            onSuccess: function(product, close, error){
                ProductService.save(product, function(data, err){
                    if(err) return err.message;
                    close(data);
                });
            }
        }, function (product) {
            $scope.products.push(product);
        });
    }

![alt tag](http://i288.photobucket.com/albums/ll178/santiagomarkbenedictesguerra/Screenshot%20from%202015-06-02%20150819_zpspt1fsviw.png)

**Edit Modal**

    $scope.editProduct = function (product) {
        $fmodal.open({
            method: "edit",
            object: product,
            show: ["id", "name", "description", "category", "price", "image"],
            options: [
                {key: "category", options: [{id:'001',name:'small'}, {id:'002',name:'big'}]}
            ],
            readOnly: ["id"],
            onSuccess: function(product, close, error){
                ProductService.save(product, function(data, err){
                    if(err) return err.message;
                    close(data);
                });
            }
        }, function (product) {
            for (var i = $scope.products.length - 1; i >= 0; i--) {
                if($scope.products[i].id == product.id){
                    $scope.products[i] = product;
                }
            };
        });
    });

![alt tag](http://i288.photobucket.com/albums/ll178/santiagomarkbenedictesguerra/Screenshot%20from%202015-06-02%20151126_zpsuk2bepij.png)

**Delete Modal**

    $scope.deleteProduct = function (product) {
        $fmodal.open({
            method: "delete",
            type: "product",
            object: product,
            show: ["id", "name"],
            onSuccess: function(product, close, error){
                ProductService.delete(product.id, function(data, err){
                    if(err) return err.message;
                    close(product);
                });
            },
        }, function (product) {
            for (var i = $scope.products.length - 1; i >= 0; i--) {
                if($scope.products[i].id == product.id){
                    $scope.products.splice(i, 1)
                    return;
                }
            };
        });
    }

![alt tag](http://i288.photobucket.com/albums/ll178/santiagomarkbenedictesguerra/Screenshot%20from%202015-06-02%20151331_zpsbrd05elr.png)

**Custom Modal**

    $scope.deliver = function(product){
        $fmodal.open({
            method: "edit",
            titleText: 'Delivery Details',
            message: '<p>Please confirm the delivery details below.</p>',
            object: {
                productId: product.id,
                'Product Name': product.name,
                'Store': product.store.name,
                'Delivery Address': undefined
            },
            show: ["Product Name", "Store", "Delivery Address"],
            readOnly: ["Product Name", "Store"],
            textAreas: ['Delivery Address'],
            okText: "Submit",
            cancelText: "Abort",
            onOk: function(deliveryDetails, close, error){
                console.log(deliveryDetails)
                // DO SOMETHING
                close();
            }
        });
    }

![alt tag](http://i288.photobucket.com/albums/ll178/santiagomarkbenedictesguerra/Screenshot%20from%202015-06-02%20145239_zpsdnjiy5mz.png)