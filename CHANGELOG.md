# v1.1.0

###### February 12, 2016

#### Dependencies

* Remove as [lodash][lodash] a dependency and make it a development dependency

#### Refactoring

* Add language utility functions to [index.js][index] in place of lodash
* Remove multiple line breaks

#### Development Maintenance

* Update [package.json][package] scripts for clarity
* Minor changes to [.travis.yml][travis] to reflect above changes



# v1.0.3

###### February 10, 2016

#### Maintenance

* Refactor [index.js][index] to improve readability
* Fix errors in [README.md][readme]

#### Development Features

* Add [CHANGELOG.md][changelog]
* Add code-style checking with [JSCS][jscs]
* Add [JSHint][jshint] as a development dependency



[lodash]: https://lodash.com/
[package]: package.json
[travis]: .travis.yml
[jscs]: http://jscs.info/
[jshint]: http://jshint.com/about/
[index]: index.js
[readme]: README.md
[changelog]: CHANGELOG.md
