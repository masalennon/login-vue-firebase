export default function ({ store, redirect}) {
  // A middleware accepts the context as it first argument. So we extract store and redirect from the context.
  if (!store.getters['modules/user/isAuthenticated']) {
    console.log('redirect by authenticated.js')
    return redirect('/login')
  }
}