/**
 * Search component redux connector
 */

import { connect } from 'react-redux'

import SearchView from './SearchView'

function mapStateToProps (state) {
    return {
        connections: state.connections,
        activeTab: state.activeTab
    }
}

function mapDispatchToProps (dispatch) {
    return {
        setNamespaceAndUrl (id, namespace, url) {
            dispatch({
                type: 'SET_NAMESPACE_AND_URL',
                id,
                namespace,
                url: makeSureItsGotHttp(url)
            })
        }
    }
}

const Search = connect(mapStateToProps, mapDispatchToProps)(SearchView)

export default Search

/**
 * Validates url, adds http or https if necessary
 * 
 * @param  {String} url url to validate
 * 
 * @return {String}     validated url
 */
function makeSureItsGotHttp (url) {
    const lowerCaseUrl = url.toLowerCase()
    const hasHttp = lowerCaseUrl.indexOf("http://") === 0
    const hasHttps = lowerCaseUrl.indexOf("https://") === 0
    let result
    if ( !hasHttps && !hasHttp )
        result = `http://${url}`
    else
        result = url
    return result
}
