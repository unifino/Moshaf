import * as NS                          from "@nativescript/core"
import * as TS                          from "@/../types/myTypes"
import store                            from "@/store/store"
import * as storage                     from "@/mixins/storage"
import * as tools                       from "@/mixins/tools"

// -- =====================================================================================

export const cloudURL = "https://serene-falls-03482.herokuapp.com/"; 

// -- =====================================================================================

export async function sync( mode: "down"|"up" ): Promise<void> {

    switch ( mode ) {
        case "down" : await getVar().then( db_ver => down_Cloud( db_ver ) );
        case "up"   : return up_Cloud();
    }

}

// -- =====================================================================================

function getVar (): Promise<number> {

    let url = cloudURL + "getVer";

    return new Promise( (rs, rx) => {

        NS.Http.getJSON( url ).then(
            ( res: TS.cloud_response ) => {

                // .. resolve
                if ( res.status === 200 ) rs( parseInt( res.answer as string ) );
                else rx( res.status );
            },
            e => rx( e + ' : 002 Server Version!' )
        )
        .catch( e => rx( e + ' : 001 Server Version!' ) );

    } );

}

// -- =====================================================================================

export function down_Cloud( db_ver: number ): Promise<void> {

    // .. get rows!
    let alreadyGotIDs: number[] = [];

    if ( db_ver <= store.state.db_ver ) {
        // .. get IDs of already downloaded rows
        alreadyGotIDs = Object.keys( store.state.cloud ).reduce( (soFar,nxtOne) => {
            if ( store.state.cloud[ nxtOne ].length ) soFar.push( Number(nxtOne) +1 );
            return soFar;
        }, [] );
    }

    let url = cloudURL + "download?i=" + alreadyGotIDs.join( "," );

    return new Promise( (rs, rx) => {

        NS.Http.getJSON( url ).then(
            ( res: TS.cloud_response ) => {

                if ( res.status === 200 ) {

                    // .. soft registration of data
                    for ( let y of <TS.Architecture[]>res.answer ) {

                        // ! test it with a better way
                        try {
                            if ( y.patch ) {
                                let str = JSON.parse( JSON.stringify( y.patch ) );
                                store.state.cloud[ y.id -1 ] = str;
                            }
                        }
                        catch (e) { console.log(e) }

                        // .. a new DB has been released!
                        if ( db_ver > store.state.db_ver ) {
                            // .. replace the current Cloud DB whit new one
                            store.state.cloud = [ ( res.answer as TS.Architecture[] )[0].patch ];
                            // .. register the current DB version
                            store.state.db_ver = db_ver;
                            // .. hard register the changes
                            storage.saveDB( storage.cloud_File, store.state.cloud );
                            storage.db_ver_File.writeText( store.state.db_ver.toString() );
                        }

                    }

                    // .. hard registration of data
                    storage.saveDB( storage.cloud_File, store.state.cloud );

                    // .. resolve
                    rs();

                }
                else rx( res.status );

            },
            e => rx( e + ' : 002 Server Collections!' )
        )
        .catch( e => rx( e + ' : 001 Server Collections!' ) );

    } );

}

// -- =====================================================================================

export function up_Cloud(): Promise<void> {

    let url = cloudURL + "upload";

    return new Promise( (rs, rx) => {

        NS.Http.request( {
            url: url ,
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify( {
                d: JSON.stringify( store.state.earth )
            } )
        } )
        .then(
            res_x => {

                let res = res_x.content.toJSON() as TS.cloud_response;

                if ( res.status === 200 ) {
                    // .. merge earth into the cloud
                    store.state.cloud.push( store.state.earth );
                    // .. purge earth
                    store.state.earth = [];
                    // .. hard registration of data
                    storage.saveDB( storage.cloud_File, store.state.cloud );
                    storage.saveDB( storage.earth_File, store.state.earth );
                    // .. resolve
                    rs();
                }
                else rx( res.status );

            },
            e => rx( e + ' : 004 Server Collections!' )
        )
        .catch( e => rx( e + ' : 003 Server Collections!' ) );

    } );

}

// -- =====================================================================================
