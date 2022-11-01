## User Model:
+ id
+ create
+ update

+ email
+ password
+ role(client|owner|delivery)


## User CRUD:
+ Create Account
+ Log In
+ See Profile
+ Edit Profile
+ Verify Email

## Restaurant Model
+ name
+ category
+ address
+ coverImage

## category 
+ see categories
+ see Restaurant by Category
+ see Restaurants(pagination)
+ see Restaurant


## dish
+ create dish
+ edit dish
+ delete dish

## order
+ order CRUD
+ order subscription
    + Pending Orders(Owner)
    + Order Status(Customer, Delivery, Owner)
    + Pending Pickup Order(Delivery)

## payments


+ Owner : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiaWF0IjoxNjY3MDE2MjYyfQ.xbAjlRHWS08Rho1kD2Yl-nVG1lY3sDLfvVKrLFOpMKQ"
+ Client : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTY2NzMzMTE2Nn0.-LLlJLA57MxD6WZYbV0RKTThazLlovZr--qrv3sja4g"
+ Delivery : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImlhdCI6MTY2NzMzMzI3NX0.t39cvVav_7eaB4Tt-M-fkdMGpgz-w9d5EzPEZgEu9I0"