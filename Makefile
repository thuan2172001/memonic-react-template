recreate-prod:
	@docker-compose --env-file=deploy/dev/.env.production -f deploy/dev/docker-production.yml up --build -d --force-recreate -V
build-image:
	@docker-compose --env-file=deploy/dev/.env.production -f deploy/dev/docker-production.yml build --no-rm 