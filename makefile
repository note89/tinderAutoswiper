build:
	./node_modules/.bin/webpack
	rm -rf package
	mkdir package
	cp dist/content.bundle.js dist/popup.bundle.js popup.html icon.png manifest.json package

clean:
	rm -rf dist

check: typescript

typescript:
	./node_modules/.bin/tsc --noEmit
