.PHONY: all build doc mock test itest push push-latest clean clean-dev dev

APP_NAME=$(shell cat package.json  | jq -r '.name' | tr '[:upper:]' '[:lower:]')
APP_VERSION=$(shell cat package.json  | jq -r '.version')
RELEASE_BUILD_NUMBER := ${bamboo_buildNumber}

all: build test itest push push-latest 

build:
	@echo Starting to build $(APP_NAME):$(APP_VERSION)-$(RELEASE_BUILD_NUMBER)
	@echo "version=$(APP_VERSION)-$(RELEASE_BUILD_NUMBER)" > variables.txt
	@docker build --no-cache=true -f Dockerfile -t $(APP_NAME):$(APP_VERSION)-$(RELEASE_BUILD_NUMBER) -t $(APP_NAME):latest .

push:
	@echo Pushing docker image to the registry $(APP_NAME):$(APP_VERSION)-$(RELEASE_BUILD_NUMBER)
	@docker push $(APP_NAME):$(APP_VERSION)-$(RELEASE_BUILD_NUMBER)

push-latest:
	@echo Pushing docker image for latest
	@docker push $(APP_NAME):latest

test:
	@echo Start testing $(APP_NAME):$(APP_VERSION)-$(RELEASE_BUILD_NUMBER)
	@docker-compose -f ./docker-compose.test.yml build
	@docker-compose -f ./docker-compose.test.yml up --build --exit-code-from test test
	@docker-compose -f ./docker-compose.test.yml down

itest:
	@echo Start intergration test $(APP_NAME):$(APP_VERSION)-$(RELEASE_BUILD_NUMBER)
	@docker-compose -f ./docker-compose.itest.yml build
	@docker-compose -f ./docker-compose.itest.yml up -d api
	@docker-compose -f ./docker-compose.itest.yml up --exit-code-from itest itest 
	@docker-compose -f ./docker-compose.itest.yml down

dev:
	@echo Start Development Environment
	@docker-compose build
	@docker-compose up api

doc:
	@echo Generating API Documentation
	@cd ./docs && yarn doc && open ./index.html

mock:
	@echo Start Mock Server
	@cd ./docs && yarn mock

clean-dev:
	@echo Clean up
	@docker-compose - down
	@docker volume rm $(docker volume ls -qf dangling=true)
	@docker rm $(docker ps -q -f 'status=exited')
	@docker rmi $(docker images -q -f "dangling=true")

clean:
	@echo Clean up
	@docker-compose -f ./docker-compose.test.yml down
	@docker-compose -f ./docker-compose.itest.yml down