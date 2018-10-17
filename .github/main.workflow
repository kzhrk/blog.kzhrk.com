workflow "mainflow" {
  on = "push"
  resolves = ["build", "deploy"]
}

action "build" {
  uses = "./actions/build"
}

action "deploy" {
  uses = "./actions/deploy"
}