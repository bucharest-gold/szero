ci: test
	npm run coverage
	npm run prepublish
	npm run docs

test: lint
	npm test

lint: node_modules
	npm run lint

publish-docs:
	./publish-docs.sh

clean:
	rm -rf node_modules coverage docs publish

node_modules: package.json
	npm install

.PHONY: node_modules