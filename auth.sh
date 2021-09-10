
#!/usr/bin/env bash
checkUptodate()
{
     if ! [[ $(git pull) =~ "Already up to date." ]]; then
        echo "1";
    else
        echo "0";
    fi

}

loop() {
    shouldDeploy=$( checkUptodate  )
    if  [[ $shouldDeploy =~ "1" ]]; then
        make build-image
        make recreate-prod
        echo "Build at $(date +"%T")"
        
    fi

}

while true
do
    loop
    sleep 40
done