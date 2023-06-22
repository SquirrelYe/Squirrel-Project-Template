# 为依赖项和目标设置变量
IMAGE_NAME ?= squirrel-project-template-server
CONTAINER_NAME ?= squirrel-project-template-server
PORT ?= 3000

build:
	docker build -t $(IMAGE_NAME) .

run:
	docker run -d -p $(PORT):$(PORT) --name $(CONTAINER_NAME) $(IMAGE_NAME)

clean:
	-docker stop $(CONTAINER_NAME)
	-docker rm $(CONTAINER_NAME)

compress:
	zip -r compressed-project.zip . -x "node_modules/*" "dist/*"

all: build run