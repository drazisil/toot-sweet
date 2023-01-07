cert:
	@echo "Generating private key."
	openssl genrsa -out data/dev-key.pem 2048

	@echo "Generating Certificate Signing Request (CSR) file."
	@openssl req -x509 -extensions v3_req -config data/dev.cnf -key data/dev-key.pem -out data/dev-crt.pem

