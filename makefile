build:
	./node_modules/.bin/webpack

clean:
	rm -rf dist

check: typescript

typescript:
	./node_modules/.bin/tsc --noEmit
