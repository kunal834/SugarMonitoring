# Sugar Monitring For Diabetes patients 

# Project Requirements 
1-> Sugar Monitoring 
2-> Data Fitting 
3-> Data into Analytics 
4-> Hba1c calculators
5-> Diobs (special chatbot)


# Procedure to create this
1.Auth(Email sender)
2.Data form 
3.Aggregate Pipeline works 



# For Auth using Nodemail + MagicLink for signup and login 
Now understand the flow of login and verify login in magiclink 
Login route send token in URL 
Verify by taking from url 
upsert(in Mongodb) => update and insert 
JWT 
Function,Purpose,Requires Secret Key?,Use When...
.sign(),Creates a token,Yes,User logs in.
.verify(),Validates + Decodes,Yes,User makes an API request.
.decode(),Only reads data,No,You just need the payload info.