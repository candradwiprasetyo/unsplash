export default ({ $axios, app }) => {

  $axios.onRequest(config => {
    const access_key = 'FZpIl7feLseFHwV4DScQqiaVULO54C7GRBiqlmDrxdI'
    config.headers.common['Authorization'] = `Client-ID ` + access_key;
  });

}