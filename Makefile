ENV=development

NPMFLAGS?=

.PHONY: build
build:
	npx swc ./index.js --env-name $(ENV) -o main.js

.PHONY: all
all: build

.PHONY: test
test:
	npx jest test.js $(NPMFLAGS)


.PHONY: dev
dev:
	NPMFLAGS="--watchAll" make -C . -k test
