build:
	./node_modules/.bin/webpack
	rm -rf package
	mkdir package
	cp -r dist popup.html icon.png manifest.json package
	rm -rf package/dist/*.map

clean:
	rm -rf dist

check: typescript

typescript:
	./node_modules/.bin/tsc --noEmit
