sed -r 's|<\s*ref([^>]*)>\s*([a-zA-Z0-9/._]*)\s*<\s*/ref\s*>|<copy\1 tname="\2" />|g' < $1  > temp.js
sed -r 's|<\s*collect([^>]*)>\s*([a-zA-Z0-9/._]*)\s*<\s*/collect\s*>|<collect\1 tname="\2" />|g' < temp.js  > temp2.js
sed -r 's|_ref([0-9]+)|_copy\1|g' < temp2.js > $1

