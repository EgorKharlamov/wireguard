## Run the pipe

```bash
mkfifo runner.pipe
while true; do eval "$(cat runner.pipe)"; done
```
