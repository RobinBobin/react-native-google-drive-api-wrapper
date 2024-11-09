#!/bin/bash
rm -rf js &&
pnpm tsc &&
pnpm eslint &&
pnpm prettier . --check
