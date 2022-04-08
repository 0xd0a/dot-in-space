#!/bin/bash

rsync -avz --filter=':- .gitignore' -e "ssh -i ~/.ssh/dotinspace_rsa" . xx@dot-in.space:/home/xx/dothive
