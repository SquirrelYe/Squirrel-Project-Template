SOURCE_NAME ?= squirrel-project-admin-static

build:
	-pnpm run build

clean:
	-rm -rf dist
	-rm $(SOURCE_NAME)

compress:
	-rm -rf dist
	-rm $(SOURCE_NAME)
	-pnpm run build
	-zip -r $(SOURCE_NAME).zip dist
