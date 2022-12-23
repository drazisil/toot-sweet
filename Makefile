ALL: 
	openssl genpkey -algorithm RSA -out data/private_key.pem -pkeyopt rsa_keygen_bits:2048 
	openssl rsa -pubout -in data/private_key.pem -out data/public_key.pem