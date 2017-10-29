build:
	./node_modules/.bin/webpack
	rm -rf package
	mkdir package
	cp -r dist css popup.html icon.png manifest.json package
	rm -rf package/dist/*.map
	rm -f publish.zip
	zip -r publish.zip package

clean:
	rm -rf dist

check: typescript

typescript:
	./node_modules/.bin/tsc --noEmit
