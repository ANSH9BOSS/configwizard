import React from 'react';
import { NavLink } from 'react-router-dom';
import { ServerContext } from '@/state/server';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';

export default function AdditionalServerItems() {
    const match = ServerContext.useStoreState((state) => state.server.data);
    if (!match) return null;

    return (
        <NavLink to={`/server/${match.id}/configwizard`}>
            <FontAwesomeIcon icon={faWandMagicSparkles} />
            <span>ConfigWizard</span>
        </NavLink>
    );
}
